import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DatePicker from '@react-native-community/datetimepicker';
import { Platform, Alert } from 'react-native';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/Auth';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProviderListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContainer,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';
import api from '../../services/api';

interface RouteParams {
  providerId: string;
}
export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}
interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();
  const route = useRoute();
  const [providers, setProviders] = useState<Provider[]>([]);
  const routeParams = route.params as RouteParams;
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [selectedHour, setSelectedHour] = useState(0);
  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);
  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);
  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);
  const handleToggleDatePicker = useCallback(() => {
    setShowDataPicker(state => !state);
  }, []);
  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDataPicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);
  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedDate: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedDate: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);
  const handleHourSelected = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);
  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);
      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });
      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'Error ao criar agendamento',
        'Ocorreu um erro ao criar o agendamento, tente mais tarde',
      );
    }
  }, [navigate, selectedProvider, selectedDate, selectedHour]);
  return (
    <Container>
      <Header>
        <BackButton onPress={() => goBack()}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireros</HeaderTitle>
        <UserAvatar
          source={{
            uri: user.avatar_url,
          }}
        />
      </Header>
      <Content>
        <ProviderListContainer>
          <ProvidersList
            data={providers}
            keyExtractor={provider => String(provider.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProviderListContainer>
        <Calendar>
          <Title>Escolha a Data</Title>
          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDataPicker && (
            <DatePicker
              mode="date"
              display="calendar"
              textColor="#f4ede8"
              value={selectedDate}
              onChange={handleDateChange}
            />
          )}
        </Calendar>
        <Schedule>
          <Title>Escilah o horario</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContainer>
              {morningAvailability.map(({ formattedDate, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={hour === selectedHour}
                  available={available}
                  key={formattedDate}
                  onPress={() => handleHourSelected(hour)}
                >
                  <HourText selected={hour === selectedHour}>
                    {formattedDate}
                  </HourText>
                </Hour>
              ))}
            </SectionContainer>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContainer>
              {afternoonAvailability.map(
                ({ formattedDate, hour, available }) => (
                  <Hour
                    enabled={available}
                    selected={hour === selectedHour}
                    available={available}
                    key={formattedDate}
                    onPress={() => handleHourSelected(hour)}
                  >
                    <HourText selected={hour === selectedHour}>
                      {formattedDate}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContainer>
          </Section>
        </Schedule>
        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
